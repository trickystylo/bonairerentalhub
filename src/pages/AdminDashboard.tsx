import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CsvUploader } from "@/components/CsvUploader";
import { BackNavigation } from "@/components/BackNavigation";
import { toast } from "@/components/ui/use-toast";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { DuplicateListingDialog } from "@/components/admin/DuplicateListingDialog";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { ListingStats } from "@/components/admin/ListingStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ITEMS_PER_PAGE = 15;

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateListingName, setDuplicateListingName] = useState("");
  const [pendingListingData, setPendingListingData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAdmin();
  }, [navigate]);

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate('/login');
      return;
    }

    const { data: adminData } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminData) {
      navigate('/');
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
      return;
    }

    setIsAdmin(true);
    fetchListings();
  };

  const fetchListings = async () => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error, count } = await supabase
      .from('listings')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    if (currentPage === 1) {
      setListings(data || []);
    } else {
      setListings(prev => [...prev, ...(data || [])]);
    }
    
    setHasMore(count ? count > to + 1 : false);
  };

  useEffect(() => {
    if (isAdmin) {
      fetchListings();
    }
  }, [currentPage, isAdmin]);

  const handleLoadMore = () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleDelete = async (ids: string[]) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .in('id', ids);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete listings",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: `${ids.length} listing(s) deleted successfully`,
    });
    
    setCurrentPage(1);
    fetchListings();
  };

  const handleAdSubmit = async (newAd: any) => {
    const { error } = await supabase
      .from('advertisements')
      .insert([newAd]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create advertisement",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Advertisement created successfully",
    });
  };

  // New handler for CSV data upload
  const handleCsvUpload = async (data: any[]) => {
    if (data && data.length > 0) {
      // Store the first listing data for potential duplicate handling
      setPendingListingData(data[0]);
      setDuplicateListingName(data[0].name || '');
      setShowDuplicateDialog(true);
    }
  };

  // Handler for duplicate dialog actions
  const handleCsvAction = async (action: "create" | "merge" | "ignore") => {
    if (!pendingListingData) return;
    
    if (action === "create") {
      const { error } = await supabase
        .from('listings')
        .insert([pendingListingData]);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to create listings",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Success",
        description: "Listings created successfully",
      });
      fetchListings();
    }
    
    setPendingListingData(null);
    setShowDuplicateDialog(false);
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <BackNavigation />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-caribbean bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>
        
        <Tabs defaultValue="listings" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 lg:w-[500px]">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="listings" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
              <CardHeader>
                <CardTitle>Upload Listings</CardTitle>
                <CardDescription>Upload your CSV file with listing data</CardDescription>
              </CardHeader>
              <CardContent>
                <CsvUploader onUpload={handleCsvUpload} />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
              <CardHeader>
                <CardTitle>Manage Listings</CardTitle>
                <CardDescription>View and manage all listings</CardDescription>
              </CardHeader>
              <CardContent>
                <ListingsTable 
                  listings={listings} 
                  onDelete={handleDelete}
                  currentPage={currentPage}
                  onLoadMore={handleLoadMore}
                  hasMore={hasMore}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="categories" className="space-y-8">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="advertisements" className="space-y-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
              <CardHeader>
                <CardTitle>Create Advertisement</CardTitle>
                <CardDescription>Add a new advertisement position</CardDescription>
              </CardHeader>
              <CardContent>
                <AdvertisementForm onSubmit={handleAdSubmit} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-8">
            <ListingStats />
          </TabsContent>
        </Tabs>

        <DuplicateListingDialog
          isOpen={showDuplicateDialog}
          onClose={() => setShowDuplicateDialog(false)}
          onAction={handleCsvAction}
          duplicateName={duplicateListingName}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;

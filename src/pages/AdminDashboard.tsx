import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CsvUploader } from "@/components/CsvUploader";
import { BackNavigation } from "@/components/BackNavigation";
import { toast } from "@/components/ui/use-toast";
import { ListingsTable } from "@/components/admin/ListingsTable";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { DuplicateListingDialog } from "@/components/admin/DuplicateListingDialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [duplicateListingName, setDuplicateListingName] = useState("");
  const [pendingListingData, setPendingListingData] = useState<any>(null);
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
    const { data, error } = await supabase
      .from('listings')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching listings:", error);
      return;
    }

    setListings(data || []);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('listings')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete listing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Listing deleted successfully",
    });
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

  const handleDuplicateAction = async (action: 'create' | 'merge' | 'ignore') => {
    if (!pendingListingData) return;

    switch (action) {
      case 'create':
        const { error: createError } = await supabase
          .from('listings')
          .insert([pendingListingData]);
        
        if (createError) {
          toast({
            title: "Error",
            description: "Failed to create new listing",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "New listing created successfully",
          });
        }
        break;

      case 'merge':
        const { error: mergeError } = await supabase
          .from('listings')
          .update(pendingListingData)
          .eq('name', pendingListingData.name);
        
        if (mergeError) {
          toast({
            title: "Error",
            description: "Failed to merge listing data",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Listing data merged successfully",
          });
        }
        break;

      case 'ignore':
        toast({
          title: "Info",
          description: "Upload ignored",
        });
        break;
    }

    setShowDuplicateDialog(false);
    setPendingListingData(null);
    fetchListings();
  };

  const handleCsvUpload = async (data: any) => {
    // Check for duplicates
    const existingListing = listings.find(listing => listing.name === data.name);
    
    if (existingListing) {
      setDuplicateListingName(data.name);
      setPendingListingData(data);
      setShowDuplicateDialog(true);
      return;
    }

    // If no duplicate, proceed with creation
    const { error } = await supabase
      .from('listings')
      .insert([data]);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to create listing",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Listing created successfully",
    });
    fetchListings();
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
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
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
                <ListingsTable listings={listings} onDelete={handleDelete} />
              </CardContent>
            </Card>
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
        </Tabs>

        <DuplicateListingDialog
          isOpen={showDuplicateDialog}
          onClose={() => setShowDuplicateDialog(false)}
          onAction={handleDuplicateAction}
          duplicateName={duplicateListingName}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
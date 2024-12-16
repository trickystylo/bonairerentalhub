import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BackNavigation } from "@/components/BackNavigation";
import { toast } from "@/components/ui/use-toast";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { CategoryManager } from "@/components/admin/CategoryManager";
import { ListingStats } from "@/components/admin/ListingStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingsSection } from "@/components/admin/ListingsSection";

const ITEMS_PER_PAGE = 15;

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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

          <TabsContent value="listings">
            <ListingsSection 
              listings={listings}
              onDelete={handleDelete}
              currentPage={currentPage}
              onLoadMore={handleLoadMore}
              hasMore={hasMore}
              onListingsUpdate={fetchListings}
            />
          </TabsContent>

          <TabsContent value="categories">
            <CategoryManager />
          </TabsContent>

          <TabsContent value="advertisements">
            <div className="space-y-8">
              <AdvertisementForm onSubmit={handleAdSubmit} />
            </div>
          </TabsContent>

          <TabsContent value="stats">
            <ListingStats />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
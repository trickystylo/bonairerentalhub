import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { BackNavigation } from "@/components/BackNavigation";
import { toast } from "@/components/ui/use-toast";
import { AdvertisementForm } from "@/components/admin/AdvertisementForm";
import { ListingStats } from "@/components/admin/ListingStats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ListingsSection } from "@/components/admin/ListingsSection";

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
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
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="listings">Listings</TabsTrigger>
            <TabsTrigger value="advertisements">Advertisements</TabsTrigger>
            <TabsTrigger value="stats">Statistics</TabsTrigger>
          </TabsList>

          <TabsContent value="listings">
            <ListingsSection 
              listings={listings}
              onDelete={handleDelete}
              currentPage={1}
              onLoadMore={() => {}}
              hasMore={false}
              onListingsUpdate={fetchListings}
            />
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
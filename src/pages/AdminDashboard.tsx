import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CsvUploader } from "@/components/CsvUploader";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { BackNavigation } from "@/components/BackNavigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
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

    checkAdmin();
  }, [navigate]);

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
        
        <div className="grid gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-muted animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-primary">Upload Listings</h2>
            <CsvUploader onUpload={fetchListings} />
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-muted animate-fade-in">
            <h2 className="text-xl font-semibold mb-4 text-primary">Manage Listings</h2>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Price Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {listings.map((listing) => (
                    <TableRow key={listing.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell className="font-medium">{listing.name}</TableCell>
                      <TableCell>{listing.display_category}</TableCell>
                      <TableCell>{listing.rating}</TableCell>
                      <TableCell>{"€".repeat(listing.price_level)}</TableCell>
                      <TableCell>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDelete(listing.id)}
                          className="hover:scale-105 transition-transform"
                        >
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
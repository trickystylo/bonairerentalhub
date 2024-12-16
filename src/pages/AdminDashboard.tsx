import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { CsvUploader } from "@/components/CsvUploader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Advertisement {
  id: string;
  position: string;
  link: string;
  image_url: string | null;
  is_active: boolean;
}

const AdminDashboard = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [advertisements, setAdvertisements] = useState<Advertisement[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [newAd, setNewAd] = useState({
    position: "top",
    link: "",
    image_url: "",
  });
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
      fetchAdvertisements();
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

  const fetchAdvertisements = async () => {
    const { data, error } = await supabase
      .from('advertisements')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching advertisements:", error);
      return;
    }

    setAdvertisements(data || []);
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

  const handleAdSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    fetchAdvertisements();
    setNewAd({ position: "top", link: "", image_url: "" });
  };

  const toggleAdStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('advertisements')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update advertisement status",
        variant: "destructive",
      });
      return;
    }

    fetchAdvertisements();
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
                <CsvUploader onUpload={fetchListings} />
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
              <CardHeader>
                <CardTitle>Manage Listings</CardTitle>
                <CardDescription>View and manage all listings</CardDescription>
              </CardHeader>
              <CardContent>
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
                <form onSubmit={handleAdSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Position</label>
                      <select
                        className="w-full p-2 border rounded-md"
                        value={newAd.position}
                        onChange={(e) => setNewAd({ ...newAd, position: e.target.value })}
                      >
                        <option value="top">Top</option>
                        <option value="sidebar">Sidebar</option>
                        <option value="bottom">Bottom</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Link</label>
                      <Input
                        type="url"
                        value={newAd.link}
                        onChange={(e) => setNewAd({ ...newAd, link: e.target.value })}
                        placeholder="https://example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Image URL (optional)</label>
                      <Input
                        type="url"
                        value={newAd.image_url}
                        onChange={(e) => setNewAd({ ...newAd, image_url: e.target.value })}
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full">Create Advertisement</Button>
                </form>
              </CardContent>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border border-muted animate-fade-in">
              <CardHeader>
                <CardTitle>Manage Advertisements</CardTitle>
                <CardDescription>View and manage all advertisement positions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead>Position</TableHead>
                        <TableHead>Link</TableHead>
                        <TableHead>Image</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {advertisements.map((ad) => (
                        <TableRow key={ad.id} className="hover:bg-muted/30 transition-colors">
                          <TableCell className="font-medium capitalize">{ad.position}</TableCell>
                          <TableCell className="max-w-xs truncate">{ad.link}</TableCell>
                          <TableCell>{ad.image_url ? "Yes" : "No"}</TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              ad.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                            }`}>
                              {ad.is_active ? "Active" : "Inactive"}
                            </span>
                          </TableCell>
                          <TableCell>
                            <Button
                              variant={ad.is_active ? "destructive" : "default"}
                              size="sm"
                              onClick={() => toggleAdStatus(ad.id, ad.is_active)}
                              className="hover:scale-105 transition-transform"
                            >
                              {ad.is_active ? "Disable" : "Enable"}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
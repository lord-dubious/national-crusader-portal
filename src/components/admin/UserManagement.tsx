import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: users, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (profilesError) throw profilesError;

      const { data: adminUsers, error: adminError } = await supabase
        .from("admin_users")
        .select("email");

      if (adminError) throw adminError;

      // Combine the data to mark admin users
      return profiles.map(profile => ({
        ...profile,
        isAdmin: adminUsers.some(admin => admin.email === profile.email)
      }));
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole, email, isAdmin }: { userId: string; newRole: string; email: string; isAdmin: boolean }) => {
      setLoading(true);
      
      // Update profile role
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (profileError) throw profileError;

      // Update admin_users table
      if (newRole === "admin" && !isAdmin) {
        const { error: adminError } = await supabase
          .from("admin_users")
          .insert({ email });
        if (adminError) throw adminError;
      } else if (newRole !== "admin" && isAdmin) {
        const { error: adminError } = await supabase
          .from("admin_users")
          .delete()
          .eq("email", email);
        if (adminError) throw adminError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">User Management</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Admin Status</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.email}</TableCell>
              <TableCell>
                <span className={`capitalize ${user.role === "admin" ? "text-accent" : ""}`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell>
                <span className={user.isAdmin ? "text-green-500" : "text-gray-500"}>
                  {user.isAdmin ? "Admin" : "Not Admin"}
                </span>
              </TableCell>
              <TableCell>{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {user.role === "admin" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => updateRole.mutate({ 
                      userId: user.id, 
                      newRole: "viewer",
                      email: user.email,
                      isAdmin: user.isAdmin
                    })}
                  >
                    Remove Admin
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => updateRole.mutate({ 
                      userId: user.id, 
                      newRole: "admin",
                      email: user.email,
                      isAdmin: user.isAdmin
                    })}
                  >
                    Make Admin
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const UserManagement = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  const { data: users, isLoading, error, refetch } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      try {
        console.log("Fetching profiles...");
        const { data: profiles, error } = await supabase
          .from("profiles")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching profiles:", error);
          throw error;
        }

        console.log("Fetched profiles:", profiles);
        return profiles;
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
        throw error;
      }
    },
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const updateRole = useMutation({
    mutationFn: async ({ userId, newRole }: { userId: string; newRole: string }) => {
      setLoading(true);
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast({
        title: "Success",
        description: "User role updated successfully",
      });
    },
    onError: (error) => {
      console.error("Error updating role:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update user role",
      });
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load users. Please try again.{" "}
          <Button 
            variant="link" 
            className="text-white underline p-0 h-auto font-normal"
            onClick={() => refetch()}
          >
            Retry
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return <div className="text-white">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">User Management</h2>
      <Table className="border-[#333333]">
        <TableHeader>
          <TableRow className="hover:bg-[#333333] border-[#333333]">
            <TableHead className="text-[#8E9196]">Email</TableHead>
            <TableHead className="text-[#8E9196]">Role</TableHead>
            <TableHead className="text-[#8E9196]">Created At</TableHead>
            <TableHead className="text-[#8E9196]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id} className="hover:bg-[#333333] border-[#333333]">
              <TableCell className="text-white">{user.email}</TableCell>
              <TableCell>
                <span className={`capitalize ${user.role === "admin" ? "text-[#DC2626]" : "text-white"}`}>
                  {user.role}
                </span>
              </TableCell>
              <TableCell className="text-white">{new Date(user.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {user.role === "admin" ? (
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={loading}
                    onClick={() => updateRole.mutate({ 
                      userId: user.id, 
                      newRole: "viewer"
                    })}
                    className="bg-[#DC2626] text-white hover:bg-[#DC2626]/80 border-none transition-colors"
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
                      newRole: "admin"
                    })}
                    className="bg-[#DC2626] text-white hover:bg-[#DC2626]/80 border-none transition-colors"
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
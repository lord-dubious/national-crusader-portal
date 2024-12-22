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
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return profiles;
    },
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
                    className="border-[#333333] text-white hover:bg-[#DC2626] hover:text-white transition-colors"
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
                    className="border-[#333333] text-white hover:bg-[#DC2626] hover:text-white transition-colors"
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
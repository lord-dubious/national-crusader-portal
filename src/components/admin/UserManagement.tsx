import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserCog, Shield, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const UserManagement = () => {
  const { toast } = useToast();

  const { data: users, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => {
      const { data: { users }, error } = await supabase.auth.admin.listUsers();
      if (error) throw error;
      return users;
    },
  });

  const updateUserRole = async (userId: string, role: string) => {
    try {
      const { error } = await supabase.auth.admin.updateUserById(
        userId,
        { user_metadata: { role } }
      );
      
      if (error) throw error;
      
      toast({
        title: "Role updated",
        description: "User role has been successfully updated."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error updating role",
        description: error.message
      });
    }
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error fetching users",
      description: error.message
    });
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserCog className="h-5 w-5" />
          User Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Last Sign In</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge variant={user.user_metadata?.role === 'admin' ? 'destructive' : 'secondary'}>
                      {user.user_metadata?.role || 'viewer'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(user.last_sign_in_at || '').toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserRole(user.id, 'editor')}
                      >
                        <Shield className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateUserRole(user.id, 'admin')}
                      >
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
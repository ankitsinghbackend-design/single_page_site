import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useGetSites(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['sites', page, pageSize],
    queryFn: async () => {
      const res = await apiClient.get('/sites', { params: { page, pageSize } });
      return res.data.data;
    }
  });
}

export function useGetSite(id: string) {
  return useQuery({
    queryKey: ['sites', id],
    queryFn: async () => {
      const res = await apiClient.get(`/sites/${id}`);
      return res.data.data;
    },
    enabled: !!id
  });
}

export function useCreateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.post('/sites', data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success("Site created successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to create site");
    }
  });
}

export function useUpdateSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const res = await apiClient.patch(`/sites/${id}`, data);
      return res.data.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      queryClient.invalidateQueries({ queryKey: ['sites', variables.id] });
      toast.success("Site updated successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to update site");
    }
  });
}

export function useDeleteSite() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/sites/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      toast.success("Site deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete site");
    }
  });
}
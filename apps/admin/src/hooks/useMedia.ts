import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export function useGetMedia(siteId?: string, type?: string) {
  return useQuery({
    queryKey: ['media', siteId, type],
    queryFn: async () => {
      const params: any = {};
      if (siteId) params.siteId = siteId;
      if (type) params.type = type;
      
      const res = await apiClient.get('/media', { params });
      return res.data.data.items || [];
    }
  });
}

export function useUploadMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (formData: FormData) => {
      const res = await apiClient.post('/media/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success("Media uploaded successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to upload media");
    }
  });
}

export function useDeleteMedia() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`/media/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      toast.success("Media deleted successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to delete media");
    }
  });
}
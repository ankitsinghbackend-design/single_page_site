import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { toast } from "sonner";

export type PageType = "landing-page" | "product-page" | "contact-page" | "track-order-page" | "footer";

export function useGetPageConfig(siteId: string, pageType: PageType) {
  return useQuery({
    queryKey: ['pageConfig', siteId, pageType],
    queryFn: async () => {
      const res = await apiClient.get(`/sites/${siteId}/${pageType}`);
      return res.data.data;
    },
    enabled: !!siteId && !!pageType
  });
}

export function useUpsertPageConfig(siteId: string, pageType: PageType) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      const res = await apiClient.put(`/sites/${siteId}/${pageType}`, data);
      return res.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pageConfig', siteId, pageType] });
      toast.success("Saved successfully");
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.error || "Failed to save configuration");
    }
  });
}
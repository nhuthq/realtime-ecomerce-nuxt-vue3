export default function handleApiError(error: any) {
    return {
      status: error?.response?.status || 500,
      message: error?.response?._data?.message || "Unknown error",
      data: error?.response?._data?.data || null,
    };
  }
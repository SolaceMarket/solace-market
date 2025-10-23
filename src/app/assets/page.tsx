import { AssetsPage } from "@/components/pages/assets/AssetsPage";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function Page({ searchParams }: PageProps) {
  return <AssetsPage searchParams={searchParams} />;
}

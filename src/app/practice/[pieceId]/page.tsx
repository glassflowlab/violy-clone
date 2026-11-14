import { LIBRARY } from "@/lib/score/library";
import PracticeClient from "./PracticeClient";

// 靜態匯出用：預先產生所有練習頁的 pieceId
export function generateStaticParams() {
  return LIBRARY.map((p) => ({ pieceId: p.id }));
}

export const dynamicParams = false;

export default async function Page({
  params,
}: {
  params: Promise<{ pieceId: string }>;
}) {
  const { pieceId } = await params;
  return <PracticeClient pieceId={pieceId} />;
}

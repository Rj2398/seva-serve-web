import Header from "@/components/common/Header";
import Quotes from "./Quotes";

export default async function QuotesPage() {


  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      {/* <Header/> */}
      <Quotes />
    </div>
  );
}
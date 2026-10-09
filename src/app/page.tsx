"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/gfl/header";
import { Footer } from "@/components/gfl/footer";
import { BackToTop } from "@/components/gfl/back-to-top";
import { HomeView } from "@/components/gfl/home-view";
import { SiteContentProvider } from "@/components/gfl/site-content-context";
import {
  OverviewView,
  HowToJoinView,
  BattleStyleView,
  AssistanceView,
  BaseLayoutsView,
} from "@/components/gfl/content-views";
import { StaffView } from "@/components/gfl/staff-view";
import { isPageId, type PageId } from "@/lib/pages";

function hashToPage(): PageId {
  const hash = window.location.hash.replace(/^#\/?/, "");
  return isPageId(hash) ? hash : "home";
}

export default function Home() {
  const [page, setPage] = useState<PageId>("home");

  // Restore deep link (#battle-style etc.) on first load.
  useEffect(() => {
    // Async restore avoids a cascading synchronous render on mount.
    const initial = window.setTimeout(() => {
      setPage(hashToPage());
    }, 0);
    const onHashChange = () => {
      setPage(hashToPage());
      window.scrollTo(0, 0);
    };
    window.addEventListener("hashchange", onHashChange);
    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("hashchange", onHashChange);
    };
  }, []);

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    if (window.location.hash !== `#${next}`) {
      history.pushState(null, "", `#${next}`);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <SiteContentProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <Header page={page} onNavigate={navigate} />
        <div className="flex-1" key={page}>
          <div className="view-enter">
            {page === "home" && <HomeView onNavigate={navigate} />}
            {page === "overview" && <OverviewView />}
            {page === "how-to-join" && <HowToJoinView />}
            {page === "battle-style" && <BattleStyleView />}
            {page === "assistance" && <AssistanceView />}
            {page === "base-layouts" && <BaseLayoutsView />}
            {page === "staff" && <StaffView />}
          </div>
        </div>
        <Footer onNavigate={navigate} />
        <BackToTop />
      </div>
    </SiteContentProvider>
  );
}

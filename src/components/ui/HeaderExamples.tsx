// Example usage of the enhanced PageHeader component

import { AppLayout } from "@/components/layout/AppLayout";
import { HeaderNavigation } from "@/components/ui/HeaderNavigation";
import { MobileHeader } from "@/components/ui/MobileHeader";
import { PageHeader } from "@/components/ui/PageHeader";

// Example 1: Basic centered header with back button and text
export function ExamplePage1() {
  return (
    <AppLayout title="Trade" showBackButton={true} backUrl="/assets-list">
      <div>Content goes here</div>
    </AppLayout>
  );
}

// Example 2: Header without back text (just arrow)
export function ExamplePage2() {
  return (
    <AppLayout
      title="Settings"
      showBackButton={true}
      customHeader={
        <PageHeader
          title="Settings"
          showBackButton={true}
          showBackText={false}
          centerTitle={true}
        />
      }
    >
      <div>Content goes here</div>
    </AppLayout>
  );
}

// Example 3: Left-aligned title (traditional layout)
export function ExamplePage3() {
  return (
    <AppLayout
      title="Assets List"
      customHeader={
        <PageHeader
          title="Assets List"
          centerTitle={false}
          showSearchButton={true}
          onSearchClick={() => console.log("Search clicked")}
        />
      }
    >
      <div>Content goes here</div>
    </AppLayout>
  );
}

// Example 4: Using the standalone header components
export function ExamplePage4() {
  return (
    <div>
      <HeaderNavigation
        title="Portfolio Details"
        subtitle="Your investment overview"
        backHref="/portfolio"
        backLabel="Back"
      />
      <div>Content goes here</div>
    </div>
  );
}

export function ExamplePage5() {
  return (
    <div>
      <MobileHeader
        title="Trade AAPL"
        backHref="/assets"
        rightContent={
          <button type="button" className="text-blue-400 text-sm">
            Info
          </button>
        }
      />
      <div>Content goes here</div>
    </div>
  );
}

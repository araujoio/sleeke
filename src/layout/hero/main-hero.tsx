import { InfiniteMarquee } from "@layout/shared/infinite-marquee";
import { Logo } from "@layout/shared/logo";

const brands = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  name: `Brand ${i + 1}`,
}));

export function LogoCarousel() {
  const items = brands.map((brand) => (
    <div
      key={brand.id}
      className="flex shrink-0 items-center px-[15px] py-[19px]"
    >
      <Logo className="h-[35px] w-[100px] cursor-pointer opacity-50 transition-all hover:opacity-100" />
    </div>
  ));

  return <InfiniteMarquee speed={40}>{items}</InfiniteMarquee>;
}

export function MainHero() {
  return (
    <section className="flex w-full justify-center border-b border-border sm:px-5">
      <div className="relative flex min-h-[560px] w-full max-w-[1320px] flex-col justify-center px-4 pt-24 pb-24 sm:min-h-[650px] sm:border-x sm:border-border sm:px-8 lg:justify-start lg:pt-[204px]">
        {/* Content */}
        <div className="flex w-full flex-col">
          {/* Heading */}
          <header>
            <h1 className="text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              Lorem ipsum dolor sit amet consectetur
            </h1>

            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
          </header>

          {/* Actions */}
          <div className="mt-6 flex flex-col gap-2 md:flex-row md:items-center">
            <button className="h-8 w-full cursor-pointer rounded-md border border-border bg-background/80 px-4 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-muted md:w-[80.5938px]">
              Login
            </button>

            <button className="h-8 w-full cursor-pointer rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground backdrop-blur-sm transition-colors hover:bg-primary/80 md:w-[180px]">
              Sign Up
            </button>
          </div>
        </div>

        {/* Logo Carousel */}
        <footer className="absolute right-0 bottom-0 left-0 flex h-[72px] overflow-hidden border-t border-border bg-transparent backdrop-blur-sm">
          <LogoCarousel />
        </footer>
      </div>
    </section>
  );
}
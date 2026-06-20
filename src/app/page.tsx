import { SmoothScroll } from "@/components/landing/smooth-scroll";
import { SiteHeader } from "@/components/landing/site-header";
import { Hero } from "@/components/landing/hero";
import { SectionQuienesSomos } from "@/components/landing/section-quienes-somos";
import { SectionComoFunciona } from "@/components/landing/section-como-funciona";
import { SectionDiferenciadores } from "@/components/landing/section-diferenciadores";
import { SectionSeguridad } from "@/components/landing/section-seguridad";
import { SectionFaq } from "@/components/landing/section-faq";
import { SectionCtaFinal } from "@/components/landing/section-cta-final";
import { SiteFooter } from "@/components/landing/site-footer";

export default function Home() {
  return (
    <>
      <SmoothScroll />
      <SiteHeader />
      <Hero />
      <SectionQuienesSomos />
      <SectionComoFunciona />
      <SectionDiferenciadores />
      <SectionSeguridad />
      <SectionFaq />
      <SectionCtaFinal />
      <SiteFooter />
    </>
  );
}

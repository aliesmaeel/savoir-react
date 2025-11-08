import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Content from "~/UI/Content";

export default function interiorDesignServices() {
  const items = [
    {
      title: "Interior Design",
      text: "Escape the monotony and sameness of the world of uniform fashion and discover modern elegance and originality with Savoir Prive's interior design services. Our dedicated team of talented professionals specializes in crafting high-end interior designs that seamlessly blend elegance, innovation, and functionality to create spaces that reflect your unique personality and style. We believe in going beyond mere aesthetics to deliver transformative design solutions that elevate your living or working environment to new heights of opulence and refinement",
      image: "/images/interiorDesignServices/image1.jpg",
      link: "/contact-us",
    },
    {
      title: "Journey to Perfection",
      text: "Your journey with Savoir Prive starts with a deep exploration of your vision, preferences, and lifestyle requirements. Our experienced designers work closely with you to understand your aspirations and translate them into breathtaking design concepts that surpass your expectations. From luxurious residential sanctuaries to sophisticated commercial spaces, we tailor our approach to suit your specific needs, ensuring every detail reflects your individual taste and flair.",
      image: "/images/interiorDesignServices/image2.jpg",
      link: "/contact-us",
    },
    {
      title: "A World of Luxury Transformation With Savoir Prive.",
      text: "Step into a realm of elevated luxury and refinement as you explore our visionary design concepts, meticulously crafted to transcend fleeting trends and stand the test of time. Our team of top-tier interior designers and fit-out specialists collaborate seamlessly to bring your vision to life, infusing each space with a harmonious fusion of style, functionality, and grandeur. Whether you seek a serene oasis of tranquility in your home or a captivating ambiance in your commercial establishment, Savoir Prive delivers bespoke turnkey solutions that exceed your wildest imagination.",
      image: "/images/interiorDesignServices/image3.jpg",
      link: "/contact-us",
    },
  ];

  return (
    <div>
      <AdvisoryHero />
      <PageLayout>
        <div className="flex flex-col items-start gap-[100px] w-full">
          {items.map((item: any, index: number) => (
            <Content key={index} item={item} isRight={index % 2 === 0} />
          ))}
        </div>
      </PageLayout>
    </div>
  );
}

import AdvisoryHero from "~/components/RealEstateAdvisory/AdvisoryHero";
import PageLayout from "~/layouts/PageLayout";
import Content from "~/UI/Content";

export default function propertyManagement() {
  const items = [
    {
      title: "Property Management",
      text: "It's time for your real estate investments to benefit from a dedicated team committed to delivering successful, efficient, and personalized solutions. Our wide range of services covers every detail, ensuring your property is not just managed but also maximized to its highest potential. Recognizing the complexity and time-consuming nature of managing real estate investments, we offer a comprehensive range of property management services crafted to alleviate your burden and enhance the performance of your real estate portfolio. With decades of experience and a proven track record of success, we have established ourselves as a trusted partner for property owners seeking effective solutions.",
      image: "/images/propertyManagement/image1.jpg",
      link: "/contact-us",
    },
    {
      title: "Our Commitment to Property Management",
      text: "At Savoir Prive, our approach to property management revolves around the concept of excellence. We believe that every property deserves the highest level of care and attention to ensure its long-term success. Whether you own a single residential property or a diverse portfolio of commercial assets, our team is dedicated to delivering exceptional results tailored to your unique needs and goals.What distinguishes Savoir Prive from other property management companies is our unwavering commitment to excellence in every aspect of our operations. From tenant relations to maintenance and financial management, we consistently strive to exceed our clients' expectations. Our team of experienced professionals brings a wealth of knowledge and expertise to the table, enabling us to tackle even the most complex property management challenges with confidence and precision.Transparency is one of the cornerstones of our property management philosophy. We believe in keeping our clients informed every step of the way, providing detailed reports and regular updates on the performance of their properties. By fostering open lines of communication and promoting trust and accountability, we aim to build lasting relationships with our clients based on mutual respect and integrity.",
      image: "/images/propertyManagement/image2.jpg",
      link: "/contact-us",
    },
    {
      title: "We Don't Just Manage; We Excel.",
      text: "Our commitment goes beyond industry standards to provide you with a seamless and hassle-free property management solution. Your peace of mind is our priority, and your needs take center stage in our property management services. We listen, understand, and adapt solutions to meet your goals. Leveraging the latest technology and industry best practices, we streamline operations and enhance efficiency, ensuring your real estate investments receive the attention they deserve. Our goal is clear; to provide real estate investors with the peace of mind and confidence they need to succeed in today's competitive market. Whether you are an experienced investor or new to the world of real estate, you can trust Savoir Prive to deliver results that exceed your expectations.",
      image: "/images/propertyManagement/image3.jpg",
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

import LogoText from "@/components/LogoText";

const Footer = () => {
  return (
    <footer className="w-full py-8 bg-gray-100 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-8 lg:px-12 flex flex-col gap-8 md:gap-12 md:flex-row justify-between items-start">
        {/* Contact Info Section */}
        <div className="flex flex-col gap-4">
          <LogoText />
          <address className="not-italic">
            <p>
              2972 Westheimer Rd. Santa Ana,
              <br /> Illinois 85486
            </p>
            <p>support@example.com</p>
            <p className="font-bold text-color_primary">+(1) 718-222-222</p>
          </address>
        </div>

        {/* Categories Section */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-color_primary text-lg md:text-xl uppercase">
            Categories
          </h2>
          <ul className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 gap-4">
            {[
              "American Cuisine",
              "Italian Cuisine",
              "African Cuisine",
              "Asian Cuisine",
              "Indian Cuisine",
              "Other",
            ].map((cat) => (
              <li key={cat} className="text-gray-700 dark:text-gray-300">
                {cat}
              </li>
            ))}
          </ul>
        </div>

        {/* Partners Section */}
        <div className="flex flex-col gap-4">
          <h2 className="font-bold text-color_primary text-lg md:text-xl uppercase">
            Partners
          </h2>
          {/* Partner logos or links can go here */}
        </div>
      </div>
    </footer>
  );
};

export default Footer;

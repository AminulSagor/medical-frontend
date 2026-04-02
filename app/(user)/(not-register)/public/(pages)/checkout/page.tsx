import CheckOutHeader from "@/app/(user)/(not-register)/public/(pages)/checkout/_components/checkout-header";
import OrderReviewCard from "@/app/(user)/(not-register)/public/(pages)/checkout/_components/order-review-card";
import PaymentMethodCard from "@/app/(user)/(not-register)/public/(pages)/checkout/_components/payment-method-card";
import ShippingAddressCard from "@/app/(user)/(not-register)/public/(pages)/checkout/_components/shipping-address-card";

const page = () => {
  return (
    <div className="max-w-7xl mx-auto mt-24 space-y-4 py-10">
      <CheckOutHeader />
      <div className="grid grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="col-span-2 space-y-8">
          <ShippingAddressCard />
          <PaymentMethodCard />
        </div>

        {/* RIGHT SIDE */}
        <div>
          <OrderReviewCard />
        </div>
      </div>
    </div>
  );
};

export default page;

import { customerService } from '@/services/customer-service';
import RestaurantView from '@/components/customer/restaurant/restaurant-view';

export const generateStaticParams = async () => {
  const restaurants = await customerService.getNearbyRestaurants();
  return restaurants.map((restaurant) => ({
    id: restaurant.id,
  }));
}

export default async function RestaurantPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const restaurant = await customerService.getRestaurantById(params.id);
  const menuItems = await customerService.getMenuItems(params.id);

  if (!restaurant) {
    return (
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-2">Restaurant not found</h1>
          <p className="text-gray-500 mb-4">This restaurant doesn&apos;t exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return <RestaurantView restaurant={restaurant} menuItems={menuItems} />;
}
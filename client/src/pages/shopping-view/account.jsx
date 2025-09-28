import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import accImg from '../../assets/account.jpg';
import Orders from './orders';
import Address from './address';
import ShoppingOrders from './orders';
import { useState } from 'react';

function ShoppingAccount() {
    const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);

    return (
        <div className="flex flex-col">
            <div className="relative h-[400px] w-full overflow-hidden">
                <img
                    src={accImg}
                    alt='account'
                    className='h-full w-full object-cover object-center'
                />
            </div>
            <div className='container mx-auto grid grid-cols-1 gap-8 py-8'>
                <div className='flex flex-col rounded-lg border-gray-200 border bg-background p-6'>
                    <Tabs defaultValue='orders'>
                        <TabsList className="h-12 w-42">
                            <TabsTrigger value="orders" className="font-rajdhani cursor-pointer text-lg font-semibold">Orders</TabsTrigger>
                            <TabsTrigger value="address" className="font-rajdhani cursor-pointer text-lg font-semibold">Address</TabsTrigger>
                        </TabsList>
                        <TabsContent value="orders">
                            <ShoppingOrders/>
                        </TabsContent>
                        <TabsContent value="address">
                            <Address setCurrentSelectedAddress={setCurrentSelectedAddress}/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

export default ShoppingAccount;
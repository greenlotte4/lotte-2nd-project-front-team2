export default function Price(){

    return (<>

       <article className="priceTop">
            <h2>Pricing Plans</h2>
            <p>All plans include 40+ advanced tools and features to boost your product.<br />
                Choose the best plan to fit your needs.</p>
            <div className="discountTap relative">
                <img className="absolute" src="images/arrow-icon.png" alt="" />
                <div className="save absolute">Save up to 10%</div>
            </div>
            <div className="periodSelect flex items-center justify-center">
                <span className="mr-[20px]">Monthly</span>
                <div className="flex items-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-500 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-gray-600 after:border-gray-400 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
                </div>
                <span  className="ml-[20px]">Annually</span>
            </div>
          
       </article>
       <article className="tabWrapper flex h-[1007px]">
            <section className="tab basic mr-[20px] ">
                <img src="/images/Piggy_bank_perspective_matte 2.png" alt="돼지저금통" />
                <strong>Basic</strong>
                <span>A simple start for everyone </span>

                <div className="money flex relative justify-center items-center">
                    <span className="doller0 absolute">&#36;</span>
                    <p className="text-[40px] font-bold">0</p>
                    <span className="month0 absolute">&#47;Month</span>
                </div>
                <ul className="ml-[30px] mt-[20px]">
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>100 responses a month</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Unlimited forms and surveys</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Unlimited fields</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Basic form creation tools</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Up to 2 subdomains</span>
                    </li>

                </ul>
                <button className="upgradeBtn current">YOUR CURRENT PLAN</button>
            </section>
        <section className="tab active standard mr-[20px]">
        <img src="/images/Money_perspective_matte 2.png" alt="" />
                <strong>Basic</strong>
                <span>A simple start for everyone </span>

                <div className="money flex relative justify-center items-center">
                    <span className="doller absolute">&#36;</span>
                    <p className="text-[40px] font-bold">49</p>
                    <span className="month absolute">&#47;Month</span>
                </div>
                <ul className="ml-[30px] mt-[20px]">
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Unlimited responses</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Unlimited forms and surveys</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Instagram profile page</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Google Docs integration</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Custom “Thank you” page   </span>
                    </li>

                </ul>
                <button className="upgradeBtn active">UPGRADE</button>
 
        </section>
        <section className="tab Enterprice">
        <img src="public/images/Money_bag_perspective_matte 2.png" alt="moneybag" />
                <strong>Basic</strong>
                <span>A simple start for everyone </span>
                <div className="money flex relative justify-center items-center">
                    <span className="doller absolute">&#36;</span>
                    <p className="text-[40px] font-bold">99</p>
                    <span className="month absolute">&#47;Month</span>
                </div>
                <ul className="ml-[30px] mt-[20px]">
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>PayPal payments</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Logic Jumps</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>File upload with 5GB storage</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Custom domain support</span>
                    </li>
                    <li className="flex items-center">
                        <div className="w-[14px] h-[14px] rounded-full border mr-[10px]"></div>
                        <span>Stripe integration</span>
                    </li>

                </ul>
                <button className="upgradeBtn" >UPGRADE</button>
 
        </section>

       </article>

       <article className="ad h-[301px]">
        <div className="adWrapper relative">
            <div className="flex flex-col items-start ml-[140px]">
                <span className="still text-[20px] mb-[10px]">Still not convinced? Start with a 14-day FREE trial!</span>
                <p>You will get full access to with all the features for 14 days.</p>
                <button className="trial">Start 14-day free trial</button>
            </div>
            <img className="absolute" src="/images/users_icon2 1.png" alt="icon2" />

        </div>
       

       </article>

       <article className="mb-[40px]">
       
        <div className="container mx-auto my-10">
        <strong className="text-center items-center text-gray-800 text-[30px] mb-4"></strong>

            <h2 className="text-center text-gray-800 text-[30px] mb-4">
                Pick a plan that works best for you<br />
            </h2>
            <p className="text-center text-gray-800 text-lg mb-4">Stay cool, we have a 48-hour money back guarantee!</p>

            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                    <th className="p-4 text-gray-700 font-semibold">TYPE</th>
                    <th className="p-4 text-gray-700 font-semibold text-center">STARTER</th>
                    <th className="p-4 text-gray-700 font-semibold text-center">PRO</th>
                    <th className="p-4 text-gray-700 font-semibold text-center">ENTERPRISE</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                    <td className="p-4 text-gray-600">14-days free trial</td>
                    <td className="p-4 text-center">✔️</td>
                    <td className="p-4 text-center">✔️</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr className="bg-gray-50">
                    <td className="p-4 text-gray-600">No user limit</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✔️</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr>
                    <td className="p-4 text-gray-600">Product Support</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✔️</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr className="bg-gray-50">
                    <td className="p-4 text-gray-600">Email Support</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">Save up to 10%</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr>
                    <td className="p-4 text-gray-600">Integrations</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✔️</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr className="bg-gray-50">
                    <td className="p-4 text-gray-600">Removal of Front branding</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">Save up to 10%</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr>
                    <td className="p-4 text-gray-600">Active maintenance & support</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                    <tr className="bg-gray-50">
                    <td className="p-4 text-gray-600">Data storage for 365 days</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">❌</td>
                    <td className="p-4 text-center">✔️</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                    <td className="p-4"></td>
                    <td className="p-4 text-center">
                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                        CHOOSE PLAN
                        </button>
                    </td>
                    <td className="p-4 text-center">
                        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
                        CHOOSE PLAN
                        </button>
                    </td>
                    <td className="p-4 text-center">
                        <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition">
                        CHOOSE PLAN
                        </button>
                    </td>
                    </tr>
                </tfoot>
                </table>
            </div>
            </div>


       </article>
    
    
    </>);
}
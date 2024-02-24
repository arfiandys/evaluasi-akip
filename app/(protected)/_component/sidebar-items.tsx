import { SideNavItemGroup } from "@/types/type";
import SideBarMenuGroup from "./sidebar-menu-group";

interface SidebarItemsProps {
    selectedRoute: SideNavItemGroup[]
}

const SidebarItemsPage = ({
    selectedRoute
}: SidebarItemsProps) => {
    return (
        <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
            <div className="flex flex-col gap-2 px-5">
                {selectedRoute.map((item, idx) => {
                    return <SideBarMenuGroup key={idx} menuGroup={item} />;
                })}
            </div>
        </nav>
    );
}

export default SidebarItemsPage;
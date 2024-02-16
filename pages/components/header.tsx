import React from "react";
import { useRouter } from "next/router";

export default function Header() {
    const router = useRouter();

    const handleTop= () => {
        router.push({
        pathname: '/',
        });
    }
    return (
        <div className="sticky top-0 border p-4 bg-white text-black">
            <button className="text-xl" onClick={handleTop}>Near GOHAN</button>
        </div>
    );
    
}

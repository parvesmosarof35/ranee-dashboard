import { zegoConfig } from "@/store/config/envConfig";

let zpInstance: any = null;
let zimInstance: any = null;

export const initZegoInvitation = async (user: any) => {
    if (typeof window === "undefined") return null;
    if (zpInstance) return zpInstance;

    try {
        const { ZegoUIKitPrebuilt } = await import("@zegocloud/zego-uikit-prebuilt");
        const { ZIM } = await import("zego-zim-web");

        const userId = user._id || user.id;
        const userName = user.fullname || "User_" + userId.slice(-4);

        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            zegoConfig.appID,
            zegoConfig.serverSecret,
            userId,
            userId,
            userName
        );

        const zp = ZegoUIKitPrebuilt.create(kitToken);
        zp.addPlugins({ ZIM });

        // @ts-ignore
        zp.setCallInvitationConfig({
            // Any global config here
        });

        zpInstance = zp;
        console.log("🚀 Zego Manager: Invitation Service Initialized");
        return zpInstance;
    } catch (error) {
        console.error("❌ Zego Manager Init Error:", error);
        return null;
    }
};

export const getZpInstance = () => zpInstance;

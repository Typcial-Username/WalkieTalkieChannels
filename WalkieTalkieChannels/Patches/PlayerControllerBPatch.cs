using GameNetcodeStuff;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine.InputSystem;
using WalkieTalkieChannels;

namespace WalkieTalkieChannels.Patches
{
    [HarmonyPatch(typeof(PlayerControllerB))]
    internal class PlayerControllerBPatch
    { 

        [HarmonyPatch("Awake")]
        [HarmonyPostfix]
        public static void Awake()
        {
            SetupKeybindCallbacks();
        }

        public static void SetupKeybindCallbacks()
        {
            WalkieTalkieChannels._Instance.Actions.ChannelIncrease.performed += IncreaseWalkieTalkieChannel;
            WalkieTalkieChannels._Instance.Actions.ChannelDecrease.performed += DecreaseWalkieTalkieChannel;

            WalkieTalkieChannels._Instance.logger.LogInfo("Keybind Callbacks Registered");
        }

        static void IncreaseWalkieTalkieChannel(InputAction.CallbackContext increaseContext)
        {
            if (!increaseContext.performed) return;
            HUDManager.Instance.DisplayTip("Channel Walkie Talkie", "Increased Channel to ");


        }

        static void DecreaseWalkieTalkieChannel(InputAction.CallbackContext decreaseContext)
        {
            if  (!decreaseContext.performed) return;

            HUDManager.Instance.DisplayTip("Channel Walkie Talkie", "Decreased Channel to ");
        }

        bool isHoldingWalkie(ref PlayerControllerB __instance, int slot)
        {
            return __instance.ItemSlots[slot].gameObject.GetComponent<ChannelWalkieTalkie>() != null;
        }

        [HarmonyPatch("SwitchToItemSlot")]
        [HarmonyPostfix]
        void SwitchToWalkieTalkie(ref PlayerControllerB __instance, ref int slot)
        {
            if (__instance.ItemSlots[slot].gameObject.GetComponent<ChannelWalkieTalkie>() != null)
            {
                //if (WalkieTalkieChannels._Instance.Actions.ChannelIncrease.)
                //{

                //}
            } 
        }
    }
}

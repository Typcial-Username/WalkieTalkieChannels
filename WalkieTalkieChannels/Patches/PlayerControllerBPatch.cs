using GameNetcodeStuff;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WalkieTalkieChannels.Patches
{
    [HarmonyPatch(typeof(PlayerControllerB))]
    internal class PlayerControllerBPatch
    {
        [HarmonyPatch("Awake")]
        [HarmonyPostfix]
        public void Awake()
        {
            SetupKeybindCallbacks();
        }

        public void SetupKeybindCallbacks()
        {
            //WalkieTalkieChannels._Instance.Actions.ChannelIncrease.preformed += IncreaseWalkieTalkieChannel;
            //WalkieTalkieChannels._Instance.Actions.ChannelDecrease.preformed += DecreaseWalkieTalkieChannel;
        }

        void IncreaseWalkieTalkieChannel()
        {

        }

        void DecreaseWalkieTalkieChannel()
        {

        }

        [HarmonyPatch("SwitchToItemSlot")]
        [HarmonyPostfix]
        void SwitchToWalkieTalkie(ref PlayerControllerB ___instance, ref int slot)
        {s
            if (___instance.ItemSlots[slot].gameObject.GetComponent<WalkieTalkie>() != null)
            {
                //if (WalkieTalkieChannels._Instance.Actions.ChannelIncrease.)
                //{

                //}
            } 
        }
    }
}

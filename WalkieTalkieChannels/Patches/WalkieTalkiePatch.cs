using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HarmonyLib;
using UnityEngine;

namespace WalkieTalkieChannels.Patches
{
    [HarmonyPatch(typeof(WalkieTalkie))]
    internal class ChannelWalkieTalkie : WalkieTalkie
    {
        static int channel = 0;

        [HarmonyPatch(nameof(OnEnable))]
        [HarmonyPostfix]
        void OnEnable()
        {
            // Change every WalkieTalkie in the game to a ChannelWalkieTalkie
            for (int i = 0; i <  allWalkieTalkies.Count; i++)
            {
                if (typeof(WalkieTalkie) != allWalkieTalkies[i].GetType())
                {
                   allWalkieTalkies[i] = (ChannelWalkieTalkie)allWalkieTalkies[i];
                }
            }

            WalkieTalkieChannels._Instance.logger.LogInfo("All WalkieTalkies converted to ChannelWalkieTalkies!");
        }

        [HarmonyPatch(nameof(SwitchWalkieTalkieOn))]
        [HarmonyPostfix]
        void SwitchWalkieTalkieOn(ref bool ___on)
        {
            WalkieTalkieChannels._Instance.logger.LogMessage($"This WalkieTalkie is of type " + this.GetType().ToString());
            //if (on && typeof(this) == ChannelWalkieTalkie)
            //{
            //    HUDManager.Instance.DisplayTip("Custom Walkie Talkie", "This walkie has channels!");
            //}
        }

        [HarmonyPatch("TransmitOneShotAudio")]
        [HarmonyPrefix]
        static void TransmitAudioToChannel(ref float ___maxVolume, ref float ___recordingRange, AudioSource audioSource, AudioClip clip, float vol)
        {
            // Confirm the audio source is a WalkieTalkie
            if (audioSource.gameObject.GetComponent<WalkieTalkie>() != null)
            {
                WalkieTalkieChannels._Instance.logger.LogInfo("Transmitting from Walkie Talkie!");

                // Loop through each WalkieTalkie
                for (int i = 0; i < allWalkieTalkies.Count; i++)
                {
                    float distanceToWalkie = Vector3.Distance(allWalkieTalkies[i].transform.position, audioSource.transform.position);
                    if (!(distanceToWalkie < ___recordingRange))
                    {
                        continue;
                    }

                    for (int j = 0; j < allWalkieTalkies.Count; j++)
                    {
                        // Make sure WalkieTalkies are different and they are on the same channel
                        if (j != i && allWalkieTalkies[j].isBeingUsed && allWalkieTalkies[j].channel == allWalkieTalkies[i].channel)
                        {
                            float num2 = Mathf.Lerp(___maxVolume, 0f, distanceToWalkie / (___recordingRange + 3f));

                            WalkieTalkieChannels._Instance.logger.LogInfo($"Transmitting to select walkies on channel {channel}");
                            
                            // Transmit audio to other WalkieTalkies
                            allWalkieTalkies[j].target.PlayOneShot(clip, num2 * vol);
                        }
                    }
                }
            }
        }

        static void ChangeChannel(int newChannel)
        {
            channel = newChannel;
        }
    }
}

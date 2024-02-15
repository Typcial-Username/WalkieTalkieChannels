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
    internal class WalkieTalkiePatch
    {
        static int channel = 0;

        [HarmonyPatch("TransmitOneShotAudio")]
        [HarmonyPrefix]
        static void TransmitAudioToChannel(ref List<WalkieTalkie> ___allWalkieTalkies, ref float ___maxVolume, ref float ___recordingRange, AudioSource audioSource, AudioClip clip, float vol)
        {
            // Confirm the audio source is a WalkieTalkie
            if (audioSource.gameObject.GetComponent<WalkieTalkie>() != null)
            {
                WalkieTalkieChannels._Instance.logger.LogInfo("Transmitting from Walkie Talkie!");

                // Loop through each WalkieTalkie
                for (int i = 0; i < ___allWalkieTalkies.Count; i++)
                {
                    float distanceToWalkie = Vector3.Distance(___allWalkieTalkies[i].transform.position, audioSource.transform.position);
                    if (!(distanceToWalkie < ___recordingRange))
                    {
                        continue;
                    }

                    for (int j = 0; j < ___allWalkieTalkies.Count; j++)
                    {
                        // Make sure WalkieTalkies are different and they are on the same channel
                        if (j != i && ___allWalkieTalkies[j].isBeingUsed && ___allWalkieTalkies[j].channel == ___allWalkieTalkies[i].channel)
                        {
                            float num2 = Mathf.Lerp(___maxVolume, 0f, distanceToWalkie / (___recordingRange + 3f));

                            WalkieTalkieChannels._Instance.logger.LogInfo($"Transmitting to select walkies on channel {channel}");
                            
                            // Transmit audio to other WalkieTalkies
                            ___allWalkieTalkies[j].target.PlayOneShot(clip, num2 * vol);
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

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
        public struct ChannelInfo {
            public int index;
            public int channel;
        }

        public static List<ChannelInfo> channelStats = new List<ChannelInfo>();

        [HarmonyPatch(nameof(Start))]
        [HarmonyPostfix]
        static void Start(ref List<WalkieTalkie> ___allWalkieTalkies)
        {
            // Change every WalkieTalkie in the game to a ChannelWalkieTalkie
            for (int i = 0; i < ___allWalkieTalkies.Count; i++)
            {
                // Check if the WalkieTalkie has the ChannelWalkieTalkie Component
                if (___allWalkieTalkies[i].gameObject.GetComponent<ChannelWalkieTalkie>() == null)
                {
                    // Remove the old WalkieTalkie Component
                    //Destroy(allWalkieTalkies[i].gameObject.GetComponent<WalkieTalkie>());

                    // Add a ChannelWalkieTalkie Component to the Gameobject
                    ___allWalkieTalkies[i].gameObject.AddComponent<ChannelWalkieTalkie>();

                    channelStats.Add(new ChannelInfo { index = i, channel = 0 });
                }
            }

            // Confirm all walkies are
            WalkieTalkieChannels._Instance.logger.LogInfo("\n\nAll WalkieTalkies converted to ChannelWalkieTalkies!\n\n");
        }

        [HarmonyPatch(nameof(OnEnable))]
        [HarmonyPostfix]
        static void OnEnable(ref WalkieTalkie __instance)
        {
            if (__instance.gameObject.GetComponent<ChannelWalkieTalkie>() == null)
            {
                // Remove the old WalkieTalkie Component
                //Destroy(__instance.gameObject.GetComponent<WalkieTalkie>());

                // Add a ChannelWalkieTalkie Component to the Gameobject
                __instance.gameObject.AddComponent<ChannelWalkieTalkie>();

                WalkieTalkieChannels._Instance.logger.LogInfo($"\n\nSuccessfully converted {__instance.gameObject.name} to a ChannelWalkieTalkie\n\n");
            }
        }

        [HarmonyPatch("SwitchWalkieTalkieOn")]
        [HarmonyPostfix]
         static void SwitchWalkieTalkieOn(ref bool __0, ref ChannelWalkieTalkie __instance)
          {
           WalkieTalkieChannels._Instance.logger.LogInfo($"This WalkieTalkie has ChannelWalkieTalkie?: {__instance.GetComponent<ChannelWalkieTalkie>() != null}");
            if (__0 && __instance.GetComponent<ChannelWalkieTalkie>() != null)
            {
                HUDManager.Instance.DisplayTip("Custom Walkie Talkie", $"This walkie has channels!");

                //if (__instance.gameObject.GetComponent<ChannelWalkieTalkie>() != null) { __instance.gameObject.GetComponent<ChannelWalkieTalkie>().channel} 
            }
          }

        [HarmonyPatch("TransmitOneShotAudio")]
        [HarmonyPatch(new Type[] { typeof(AudioSource), typeof(AudioClip), typeof(float)})]
        [HarmonyPrefix]
        static void TransmitAudioToChannel (ref AudioSource audioSource, ref AudioClip clip, ref float vol, ref List <WalkieTalkie> ___allWalkieTalkies, ref float ___maxVolume, ref float ___recordingRange)
        {
            if (audioSource == null || clip == null) { return; }

            // Confirm the audio source is a WalkieTalkie
            if (audioSource.gameObject.GetComponent<ChannelWalkieTalkie>() != null)
            {
                WalkieTalkieChannels._Instance.logger.LogInfo($"\nMax Vol; {___maxVolume}\nRec Ramge: {___recordingRange}\nAudio Source: {audioSource}\nClip: {clip}\nVol: {vol}");
                WalkieTalkieChannels._Instance.logger.LogInfo($"Num Walkie Talkies {___allWalkieTalkies.Count}");

                WalkieTalkieChannels._Instance.logger.LogInfo("Transmitting from Walkie Talkie!");

                // Loop through each WalkieTalkie
                for (int i = 0; i < ___allWalkieTalkies.Count; i++)
                {
                    WalkieTalkieChannels._Instance.logger.LogInfo($"i: {i}");
                    float distanceToWalkie = Vector3.Distance(___allWalkieTalkies[i].transform.position, audioSource.transform.position);

                    // if (!(distanceToWalkie < ___recordingRange))
                    // {
                    //     WalkieTalkieChannels._Instance.logger.LogInfo($"WalkieTalkie {i} is out of range");
                    //     continue;
                    // }

                    for (int j = 0; j < ___allWalkieTalkies.Count; j++)
                    {
                        WalkieTalkieChannels._Instance.logger.LogInfo($"i: {i}, j: {j}");
                        // Make sure WalkieTalkies are different and they are on the same channel

                        ChannelWalkieTalkie walkie1 = ___allWalkieTalkies[i].gameObject.GetComponent<ChannelWalkieTalkie>();
                        ChannelWalkieTalkie walkie2 = ___allWalkieTalkies[i].gameObject.GetComponent<ChannelWalkieTalkie>();

                        if (walkie1 != null ||  walkie2 != null) { WalkieTalkieChannels._Instance.logger.LogWarning("One or both of Walkie1 or Walkie2 is null :("); return; }

                        int channelI = ChannelWalkieTalkie.channelStats[i].channel;
                        int channelJ = ChannelWalkieTalkie.channelStats[j].channel;

                        if (j != i && ___allWalkieTalkies[j].isBeingUsed && channelI == channelJ)
                        {
                            float multiplier = Mathf.Lerp(___maxVolume, 0f, distanceToWalkie / (___recordingRange + 3f));

                            WalkieTalkieChannels._Instance.logger.LogInfo($"Transmitting to select walkies on channel {channelI}");
                            
                            // Transmit audio to other WalkieTalkies
                            ___allWalkieTalkies[j].target.PlayOneShot(clip, multiplier * vol);
                        }
                    }
                }
            }
        }

        static void ChangeChannel(int index, int newChannel, ref List<WalkieTalkie> ___allWalkieTalkies)
        {
            if (newChannel < 0) { 
                newChannel = 0;

                HUDManager.Instance.DisplayTip("Channel Walkie Talkies", "Channels cannot go below 0", isWarning: true);
            }

            ChannelWalkieTalkie.channelStats[index] = new ChannelInfo { index = index, channel = newChannel};

            List<string> playersOnChannel = new List<string>();
            for (int i = 0; i < ___allWalkieTalkies.Count; i++)
            {
                if (i == index) continue;

                ChannelWalkieTalkie thisWalkie = ___allWalkieTalkies[i].GetComponent<ChannelWalkieTalkie>();

                if (thisWalkie == null) continue;

                int channel = ChannelWalkieTalkie.channelStats[i].channel;

                if (channel == newChannel)
                {
                    playersOnChannel.Add(___allWalkieTalkies[i].playerHeldBy.playerUsername);
                }
            }

            string players = string.Join(",\n", playersOnChannel);

            HUDManager.Instance.DisplayTip("Channel Walkie Talkie", $"Set Channel to {newChannel}\nConnected Players: {players}");
        }
    }
}

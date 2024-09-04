using BepInEx;
using BepInEx.Logging;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
//using System.Net.Http.Json;

using WalkieTalkieChannels.Patches;
using WalkieTalkieChannels.Utils;
using WalkieTalkieChannels.Utils.APIManager;

namespace WalkieTalkieChannels
{
    [BepInPlugin(GUID, NAME, VERSION)]
    //[BepInDependency("com.rune580.LethalCompanyInputUtils", BepInDependency.DependencyFlags.SoftDependency)]
    public class WalkieTalkieChannels : BaseUnityPlugin
    {
        #region Mod Info
        private const string GUID = "tech.halfwit.WalkieTalkieChannels";
        private const string NAME = "Walkie Talkie Channels";
        private const string VERSION = "1.0.0";
        #endregion

        #region Instance
        internal static WalkieTalkieChannels _Instance;
        private readonly Harmony harmony = new Harmony(GUID);
        //internal ControlActions Actions;

        internal ManualLogSource logger = new ManualLogSource(GUID);

        internal APIManager APIManager;
        #endregion

        private async void Awake()
        {
            if (_Instance == null)
            {
                _Instance = this;
            }

            BepInEx.Logging.Logger.Sources.Add(logger);

            logger.LogInfo("Patching Methods");

            harmony.PatchAll(typeof(WalkieTalkieChannels));
            harmony.PatchAll(typeof(ChannelWalkieTalkie));

            logger.LogInfo("Attempting to send POST Request to API");
            APIManager = new APIManager();
            var reqBody = new { message = "Hello, World" };
            string responce = await APIManager.PostAsync("https://localhost:3000/api", new StringContent(reqBody.ToString(), Encoding.UTF8, "application/json"));
            Logger.LogInfo("Sent POST request to API! Responce: " + responce);

            logger.LogInfo("WalkieTalkieChannels has been loaded!");
        }
    }
}
    
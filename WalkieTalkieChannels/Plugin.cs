using BepInEx;
using BepInEx.Logging;
using HarmonyLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using WalkieTalkieChannels.Patches;
//using WalkieTalkieChannels.Utils;

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
        #endregion

        private void Awake()
        {
            if (_Instance == null)
            {
                _Instance = this;
            }

            BepInEx.Logging.Logger.Sources.Add(logger);

            logger.LogInfo("Patching Methods");

            harmony.PatchAll(typeof(WalkieTalkieChannels));
            harmony.PatchAll(typeof(WalkieTalkiePatch));

            Logger.LogInfo("WalkieTalkieChannels has been loaded!");
        }
    }
}

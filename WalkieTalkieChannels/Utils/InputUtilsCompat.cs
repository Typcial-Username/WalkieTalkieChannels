using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using UnityEngine.InputSystem;

namespace WalkieTalkieChannels.Utils
{
    internal class InputUtilsCompat
    {
        public static bool Enabled = BepInEx.Bootstrap.Chainloader.PluginInfos.ContainsKey("com.rune580.LethalCompanyInputUtils");

        public static InputAction IncreaseKey => WalkieTalkieChannels._Instance.Actions.ChannelIncrease;

        public static InputAction DecreaseKey => WalkieTalkieChannels._Instance.Actions.ChannelDecrease;
    }
}

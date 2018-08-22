using System;
namespace RDSManagerAPI.Entities
{
    [Flags]
    public enum RDClientDeviceRedirectionOptions
    {
        None= 0x0000,
        AudioVideoPlayBack=0x0001,
        AudioRecording=0x0002,
        COMPort =0x0004,
        PlugAndPlayDevice = 0x0008,
        SmartCard = 0x0010,
        Clipboard = 0x0020,
        LPTPort = 0x0040,
        Drive = 0x0080,
        TimeZone = 0x0100
    }
}

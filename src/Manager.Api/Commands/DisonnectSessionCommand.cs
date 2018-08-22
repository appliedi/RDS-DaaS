namespace RDSManagerAPI.Commands
{
    using System.Collections.Generic;

    public class DisonnectSessionCommand : ICommand
    {
        public string Execute()
        {
            return string.Empty;
        }

        public object Result { get; set; }

        public void Init(Dictionary<string, object> data)
        {
        }

    }
}
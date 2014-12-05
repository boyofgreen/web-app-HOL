using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(ToDoSite.Startup))]

namespace ToDoSite
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            this.ConfigureAuth(app);
        }
    }
}

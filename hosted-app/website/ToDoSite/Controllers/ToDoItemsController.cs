namespace ToDoSite.Controllers
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Infrastructure;
    using System.Linq;
    using System.Net;
    using System.Threading.Tasks;
    using System.Web.Http;
    using System.Web.Http.Description;
    using ToDoSite.Models;

    [Authorize]
    public class ToDoItemsController : ApiController
    {
        private ApplicationDbContext db = new ApplicationDbContext();

        // GET: api/ToDoItems
        public IQueryable<ToDoItem> GetToDoItems()
        {
            return this.db.ToDoItems.Where(t => t.UserName == User.Identity.Name);
        }

        // GET: api/ToDoItems/5
        [ResponseType(typeof(ToDoItem))]
        public async Task<IHttpActionResult> GetToDoItem(Guid id)
        {
            ToDoItem toDoItem = await this.db.ToDoItems.FindAsync(id);
            if (toDoItem == null || toDoItem.UserName != User.Identity.Name)
            {
                return this.NotFound();
            }

            return this.Ok(toDoItem);
        }

        // PUT: api/ToDoItems/5
        [ResponseType(typeof(void))]
        public async Task<IHttpActionResult> PutToDoItem(Guid id, ToDoItem toDoItem)
        {
            if (!ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            if (id != toDoItem.Id)
            {
                return this.BadRequest();
            }

            toDoItem.UserName = User.Identity.Name;
            this.db.Entry(toDoItem).State = EntityState.Modified;

            try
            {
                await this.db.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!this.ToDoItemExists(id))
                {
                    return this.NotFound();
                }
                else
                {
                    throw;
                }
            }

            return this.StatusCode(HttpStatusCode.NoContent);
        }

        // POST: api/ToDoItems
        [ResponseType(typeof(ToDoItem))]
        public async Task<IHttpActionResult> PostToDoItem(ToDoItem toDoItem)
        {
            toDoItem.UserName = User.Identity.Name;

            if (!this.ModelState.IsValid)
            {
                return this.BadRequest(this.ModelState);
            }

            this.db.ToDoItems.Add(toDoItem);

            try
            {
                await this.db.SaveChangesAsync();
            }
            catch (DbUpdateException)
            {
                if (this.ToDoItemExists(toDoItem.Id))
                {
                    return this.Conflict();
                }
                else
                {
                    throw;
                }
            }

            return this.CreatedAtRoute("DefaultApi", new { id = toDoItem.Id }, toDoItem);
        }

        // DELETE: api/ToDoItems/5
        [ResponseType(typeof(ToDoItem))]
        public async Task<IHttpActionResult> DeleteToDoItem(Guid id)
        {
            ToDoItem toDoItem = await this.db.ToDoItems.FindAsync(id);
            if (toDoItem == null || toDoItem.UserName != User.Identity.Name)
            {
                return this.NotFound();
            }

            this.db.ToDoItems.Remove(toDoItem);
            await this.db.SaveChangesAsync();

            return this.Ok(toDoItem);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                this.db.Dispose();
            }

            base.Dispose(disposing);
        }

        private bool ToDoItemExists(Guid id)
        {
            return this.db.ToDoItems.Count(e => e.Id == id) > 0;
        }
    }
}
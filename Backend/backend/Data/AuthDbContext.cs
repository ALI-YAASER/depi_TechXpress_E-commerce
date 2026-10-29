using backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

/// <summary>
/// DbContext منفصل لجداول Identity فقط (AspNetUsers, AspNetRoles, ...) على نفس قاعدة البيانات.
/// جداول المتجر بتفضل على TechXpressDbContext (DB-first) من غير أي تغيير.
/// </summary>
public class AuthDbContext : IdentityDbContext<ApplicationUser>
{
    public AuthDbContext(DbContextOptions<AuthDbContext> options) : base(options) { }
}

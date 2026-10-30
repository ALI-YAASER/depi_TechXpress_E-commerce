using backend.Helpers;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace backend.Data;

public static class IdentitySeeder
{
    public static async Task SeedAsync(IServiceProvider sp)
    {
        var db = sp.GetRequiredService<TechXpressDbContext>();
        var logger = sp.GetRequiredService<ILoggerFactory>().CreateLogger("IdentitySeeder");
        var config = sp.GetRequiredService<IConfiguration>();

        await db.Database.MigrateAsync();

        var roles = sp.GetRequiredService<RoleManager<IdentityRole>>();
        foreach (var r in new[] { Roles.Admin, Roles.Customer })
            if (!await roles.RoleExistsAsync(r)) await roles.CreateAsync(new IdentityRole(r));

        // أول أدمن: بياناته من الـ user-secrets / متغيرات البيئة، ومش في الكود أبدًا.
        var email = config["Seed:AdminEmail"];
        var password = config["Seed:AdminPassword"];
        if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
        {
            logger.LogWarning("Seed:AdminEmail / Seed:AdminPassword not set; no admin account was created.");
            return;
        }

        var users = sp.GetRequiredService<UserManager<ApplicationUser>>();
        if (await users.FindByEmailAsync(email) is not null) return;

        var admin = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FullName = "Store Admin",
            EmailConfirmed = true
        };
        var result = await users.CreateAsync(admin, password);
        if (result.Succeeded)
        {
            await users.AddToRoleAsync(admin, Roles.Admin);
            logger.LogInformation("Admin account created for {Email}.", email);
        }
        else
        {
            logger.LogError("Admin seed failed: {Errors}",
                string.Join("; ", result.Errors.Select(e => e.Description)));
        }
    }
}

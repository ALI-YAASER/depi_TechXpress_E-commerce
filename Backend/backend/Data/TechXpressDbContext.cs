using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public partial class TechXpressDbContext : DbContext
{
    public TechXpressDbContext(DbContextOptions<TechXpressDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Address> Addresses { get; set; }

    public virtual DbSet<Brand> Brands { get; set; }

    public virtual DbSet<Cart> Carts { get; set; }

    public virtual DbSet<CartItem> CartItems { get; set; }

    public virtual DbSet<Category> Categories { get; set; }

    public virtual DbSet<Order> Orders { get; set; }

    public virtual DbSet<OrderItem> OrderItems { get; set; }

    public virtual DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

    public virtual DbSet<Payment> Payments { get; set; }

    public virtual DbSet<Product> Products { get; set; }

    public virtual DbSet<ProductImage> ProductImages { get; set; }

    public virtual DbSet<ProductSpecification> ProductSpecifications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Address>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Addresses_UserId");

            entity.Property(e => e.AdditionalDetails).HasMaxLength(500);
            entity.Property(e => e.BuildingNumber).HasMaxLength(50);
            entity.Property(e => e.City).HasMaxLength(100);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.PhoneNumber).HasMaxLength(30);
            entity.Property(e => e.RecipientName).HasMaxLength(200);
            entity.Property(e => e.Street).HasMaxLength(250);
        });

        modelBuilder.Entity<Brand>(entity =>
        {
            entity.HasIndex(e => e.Name, "UQ_Brands_Name").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.LogoUrl).HasMaxLength(1000);
            entity.Property(e => e.Name).HasMaxLength(150);
        });

        modelBuilder.Entity<Cart>(entity =>
        {
            entity.HasIndex(e => e.UserId, "IX_Carts_UserId");

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
        });

        modelBuilder.Entity<CartItem>(entity =>
        {
            entity.HasIndex(e => new { e.CartId, e.ProductId }, "UQ_CartItems_Cart_Product").IsUnique();

            entity.Property(e => e.Quantity).HasDefaultValue(1);

            entity.HasOne(d => d.Cart).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.CartId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CartItems_Carts");

            entity.HasOne(d => d.Product).WithMany(p => p.CartItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_CartItems_Products");
        });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasIndex(e => e.Slug, "UQ_Categories_Slug").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Slug).HasMaxLength(180);

            entity.HasOne(d => d.ParentCategory).WithMany(p => p.InverseParentCategory)
                .HasForeignKey(d => d.ParentCategoryId)
                .HasConstraintName("FK_Categories_Parent");
        });

        modelBuilder.Entity<Order>(entity =>
        {
            entity.HasIndex(e => e.PaymentStatus, "IX_Orders_PaymentStatus");

            entity.HasIndex(e => e.Status, "IX_Orders_Status");

            entity.HasIndex(e => new { e.UserId, e.CreatedAt }, "IX_Orders_UserId_CreatedAt").IsDescending(false, true);

            entity.HasIndex(e => e.OrderNumber, "UQ_Orders_OrderNumber").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DiscountAmount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.OrderNumber).HasMaxLength(50);
            entity.Property(e => e.PaymentStatus)
                .HasMaxLength(30)
                .HasDefaultValue("Pending");
            entity.Property(e => e.ShippingCost).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Pending");
            entity.Property(e => e.Subtotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TotalAmount).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Address).WithMany(p => p.Orders)
                .HasForeignKey(d => d.AddressId)
                .HasConstraintName("FK_Orders_Addresses");
        });

        modelBuilder.Entity<OrderItem>(entity =>
        {
            entity.HasIndex(e => e.OrderId, "IX_OrderItems_OrderId");

            entity.HasIndex(e => e.ProductId, "IX_OrderItems_ProductId");

            entity.Property(e => e.LineTotal).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.ProductNameSnapshot).HasMaxLength(250);
            entity.Property(e => e.Skusnapshot)
                .HasMaxLength(100)
                .HasColumnName("SKUSnapshot");
            entity.Property(e => e.UnitPrice).HasColumnType("decimal(18, 2)");

            entity.HasOne(d => d.Order).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderItems_Orders");

            entity.HasOne(d => d.Product).WithMany(p => p.OrderItems)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.SetNull)
                .HasConstraintName("FK_OrderItems_Products");
        });

        modelBuilder.Entity<OrderStatusHistory>(entity =>
        {
            entity.ToTable("OrderStatusHistory");

            entity.HasIndex(e => new { e.OrderId, e.ChangedAt }, "IX_OrderStatusHistory_OrderId_ChangedAt").IsDescending(false, true);

            entity.Property(e => e.ChangedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.ChangedByUserId).HasMaxLength(450);
            entity.Property(e => e.NewStatus).HasMaxLength(30);
            entity.Property(e => e.Note).HasMaxLength(1000);
            entity.Property(e => e.OldStatus).HasMaxLength(30);

            entity.HasOne(d => d.Order).WithMany(p => p.OrderStatusHistories)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_OrderStatusHistory_Orders");
        });

        modelBuilder.Entity<Payment>(entity =>
        {
            entity.HasIndex(e => e.OrderId, "IX_Payments_OrderId");

            entity.HasIndex(e => new { e.Provider, e.ProviderPaymentId }, "UX_Payments_ProviderPaymentId")
                .IsUnique()
                .HasFilter("([ProviderPaymentId] IS NOT NULL)");

            entity.Property(e => e.Amount).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.Currency)
                .HasMaxLength(3)
                .IsUnicode(false)
                .HasDefaultValue("EGP")
                .IsFixedLength();
            entity.Property(e => e.Provider).HasMaxLength(30);
            entity.Property(e => e.ProviderPaymentId).HasMaxLength(250);
            entity.Property(e => e.Status)
                .HasMaxLength(30)
                .HasDefaultValue("Pending");

            entity.HasOne(d => d.Order).WithMany(p => p.Payments)
                .HasForeignKey(d => d.OrderId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Payments_Orders");
        });

        modelBuilder.Entity<Product>(entity =>
        {
            entity.HasIndex(e => e.BrandId, "IX_Products_BrandId");

            entity.HasIndex(e => e.CategoryId, "IX_Products_CategoryId");

            entity.HasIndex(e => e.IsActive, "IX_Products_IsActive");

            entity.HasIndex(e => e.Price, "IX_Products_Price");

            entity.HasIndex(e => e.Sku, "UQ_Products_SKU").IsUnique();

            entity.HasIndex(e => e.Slug, "UQ_Products_Slug").IsUnique();

            entity.Property(e => e.CreatedAt).HasDefaultValueSql("(sysutcdatetime())");
            entity.Property(e => e.DiscountPrice).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.IsActive).HasDefaultValue(true);
            entity.Property(e => e.Name).HasMaxLength(250);
            entity.Property(e => e.Price).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.Sku)
                .HasMaxLength(100)
                .HasColumnName("SKU");
            entity.Property(e => e.Slug).HasMaxLength(280);

            entity.HasOne(d => d.Brand).WithMany(p => p.Products)
                .HasForeignKey(d => d.BrandId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Products_Brands");

            entity.HasOne(d => d.Category).WithMany(p => p.Products)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_Products_Categories");
        });

        modelBuilder.Entity<ProductImage>(entity =>
        {
            entity.HasIndex(e => e.ProductId, "IX_ProductImages_ProductId");

            entity.Property(e => e.ImageUrl).HasMaxLength(1000);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductImages)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductImages_Products");
        });

        modelBuilder.Entity<ProductSpecification>(entity =>
        {
            entity.HasIndex(e => new { e.ProductId, e.Name }, "UQ_ProductSpecifications_Product_Name").IsUnique();

            entity.Property(e => e.Name).HasMaxLength(150);
            entity.Property(e => e.Value).HasMaxLength(500);

            entity.HasOne(d => d.Product).WithMany(p => p.ProductSpecifications)
                .HasForeignKey(d => d.ProductId)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ProductSpecifications_Products");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

using backend.Helpers;
using Xunit;

namespace backend.Tests;

public class SlugHelperTests
{
    [Fact]
    public void Slugify_ConvertsEnglishTextToKebabCase()
    {
        var input = "Dell XPS 15 (2026 Edition)";
        var slug = SlugHelper.Slugify(input);
        Assert.Equal("dell-xps-15-2026-edition", slug);
    }

    [Fact]
    public void Slugify_SupportsArabicCharacters()
    {
        var input = "لابتوب ديل انسبيرون 15";
        var slug = SlugHelper.Slugify(input);
        Assert.Equal("لابتوب-ديل-انسبيرون-15", slug);
    }

    [Fact]
    public void Slugify_RespectsMaxLength()
    {
        var input = new string('a', 200);
        var slug = SlugHelper.Slugify(input, maxLength: 50);
        Assert.Equal(50, slug.Length);
    }

    [Fact]
    public void Slugify_RemovesLeadingAndTrailingDashes()
    {
        var input = "---Special Laptop Title---";
        var slug = SlugHelper.Slugify(input);
        Assert.Equal("special-laptop-title", slug);
    }
}

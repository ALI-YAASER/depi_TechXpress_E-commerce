using System.Text;

namespace backend.Helpers;

public static class SlugHelper
{
    /// <summary>يحوّل النص إلى slug (حروف وأرقام وشرطات). يدعم العربي أيضًا.</summary>
    public static string Slugify(string text, int maxLength = 150)
    {
        var sb = new StringBuilder();
        var lastWasDash = false;
        foreach (var ch in text.Trim().ToLowerInvariant())
        {
            if (char.IsLetterOrDigit(ch)) { sb.Append(ch); lastWasDash = false; }
            else if (!lastWasDash && sb.Length > 0) { sb.Append('-'); lastWasDash = true; }
        }
        var slug = sb.ToString().Trim('-');
        if (slug.Length > maxLength) slug = slug[..maxLength].Trim('-');
        return slug;
    }
}

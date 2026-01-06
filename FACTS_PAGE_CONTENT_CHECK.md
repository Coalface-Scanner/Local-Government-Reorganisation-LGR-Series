# Facts Page Content Verification

## ✅ What Should Always Be Visible

The Facts page (`/facts`) should now display all content sections:

### 1. **Timeline Section** (Always Visible)
- Located at the top of the page
- Shows timeline of reorganisations
- Component: `<Timeline />`

### 2. **Councils Involved Section** (Always Visible)
- Shows list of councils
- Component: `<CouncilsList />`

### 3. **Key Facts Section** (Conditional)
- **Shows if:** `facts` table has data
- **Shows:** Individual fact cards with title, content, and category
- **If empty:** Shows "No facts available yet" message

### 4. **Methodology Section** (Always Visible - Now Open by Default ✅)
- **Status:** ✅ Fixed - Now opens automatically
- **Content includes:**
  - Methods and Sources explanation
  - Evidence base (list of sources)
  - Approach description
  - Limitations section
- **Can be collapsed/expanded** by clicking the header

### 5. **Sources Section** (Always Visible - Now Open by Default ✅)
- **Status:** ✅ Fixed - Now opens automatically  
- **Content includes:**
  - Evidence from Recent Reorganisations
  - **Dorset Council** (2019) - with themes, what happened, lesson, and sources
  - **Buckinghamshire Council** (2020) - with themes, what happened, lesson, and sources
  - **Somerset Council** (2023) - with themes, what happened, lesson, and sources
  - **North Yorkshire Council** (2023) - with themes, what happened, lesson, and sources
  - **Cumberland Council and Westmorland and Furness Council** (2023) - with themes, what happened, lesson, and sources
- **Can be collapsed/expanded** by clicking the header

## What I Fixed

✅ **Methodology and Sources now open by default** - Previously they were collapsed, making it look like content was missing. Now they automatically expand when the page loads.

✅ **Both sections always show** - They're no longer dependent on whether the `facts` table has data.

## How to Verify

1. **Visit `/facts` page**
2. **Scroll down** - You should see:
   - Timeline
   - Councils List
   - Key Facts (if you have data in `facts` table)
   - **Methodology** (should be expanded/open)
   - **Sources** (should be expanded/open)

3. **Check Sources section** - It should show:
   - Header: "Sources" with a FileText icon
   - Content visible immediately (not collapsed)
   - All 5 council case studies with their sources

## If Sources Still Appears Missing

If you still don't see the Sources section:

1. **Check browser console** for errors
2. **Hard refresh** the page (Cmd+Shift+R or Ctrl+Shift+R)
3. **Check if the Sources button is there** - It should be visible even if collapsed
4. **Click the Sources button** - It should expand to show all content

## Database Content

The following sections depend on database content:

- **Key Facts** - Requires data in `facts` table
- **Timeline** - May depend on data in `councils` table or hardcoded
- **Councils List** - May depend on data in `councils` table

The following sections are **hardcoded** (always available):

- ✅ **Methodology** - Hardcoded content
- ✅ **Sources** - Hardcoded content with all 5 council case studies

## Summary

All content that was present when we started should now be visible:
- ✅ Timeline
- ✅ Councils List  
- ✅ Key Facts (if data exists)
- ✅ Methodology (now open by default)
- ✅ Sources (now open by default with all 5 council case studies)

If anything is still missing, let me know and I'll investigate further!


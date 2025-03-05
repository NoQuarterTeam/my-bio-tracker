import { db, schema } from "@/lib/db/index"
import { eq, desc, and } from "drizzle-orm"
import { calculateTrend } from "@/lib/utils"

// Save blood test data to the database
export async function saveBloodTestData(data: any) {
  // For demo purposes, we'll use a fixed user ID
  const userId = 1

  try {
    // Begin a transaction
    return await db.transaction(async (tx) => {
      // Insert the blood test
      const [bloodTest] = await tx
        .insert(schema.bloodTests)
        .values({
          userId,
          name: `Blood Test - ${new Date(data.testDate).toLocaleDateString()}`,
          date: new Date(data.testDate),
          patientInfo: data.patientInfo,
        })
        .returning()

      // Insert each health marker
      for (const marker of data.markers) {
        // Insert the marker
        await tx.insert(schema.healthMarkers).values({
          markerId: marker.id,
          bloodTestId: bloodTest.id,
          name: marker.name,
          value: marker.value,
          unit: marker.unit,
          category: marker.category,
          rangeMin: marker.range.min,
          rangeMax: marker.range.max,
        })

        // Insert the marker history
        await tx.insert(schema.healthMarkerHistory).values({
          markerId: marker.id,
          userId,
          date: new Date(data.testDate),
          value: marker.value,
        })

        // Generate recommendations based on marker values
        if (marker.value < marker.range.min || marker.value > marker.range.max) {
          const priority =
            marker.value < marker.range.min * 0.8 || marker.value > marker.range.max * 1.2 ? "high" : "medium"

          const title =
            marker.value < marker.range.min
              ? `Low ${marker.name} levels detected`
              : `High ${marker.name} levels detected`

          const description =
            marker.value < marker.range.min
              ? `Your ${marker.name} is below the normal range. Consider consulting with your healthcare provider.`
              : `Your ${marker.name} is above the normal range. Consider consulting with your healthcare provider.`

          await tx.insert(schema.recommendations).values({
            userId,
            title,
            description,
            priority,
          })
        }
      }

      return { success: true }
    })
  } catch (error) {
    console.error("Error saving blood test data:", error)
    throw error
  }
}

// Get all health markers with their history
export async function getAllHealthMarkers(userId = 1) {
  try {
    // Get all unique marker IDs for this user
    const markerIds = await db
      .select({ markerId: schema.healthMarkerHistory.markerId })
      .from(schema.healthMarkerHistory)
      .where(eq(schema.healthMarkerHistory.userId, userId))
      .groupBy(schema.healthMarkerHistory.markerId)

    const markers = []

    for (const { markerId } of markerIds) {
      // Get the latest marker data
      const latestMarker = await db
        .select()
        .from(schema.healthMarkers)
        .where(eq(schema.healthMarkers.markerId, markerId))
        .orderBy(desc(schema.healthMarkers.createdAt))
        .limit(1)

      if (latestMarker.length === 0) continue

      // Get the history for this marker
      const history = await db
        .select({
          date: schema.healthMarkerHistory.date,
          value: schema.healthMarkerHistory.value,
        })
        .from(schema.healthMarkerHistory)
        .where(and(eq(schema.healthMarkerHistory.userId, userId), eq(schema.healthMarkerHistory.markerId, markerId)))
        .orderBy(schema.healthMarkerHistory.date)

      // Calculate trend
      const trend =
        history.length > 1 ? calculateTrend(history[history.length - 1].value, history[history.length - 2].value) : 0

      markers.push({
        id: markerId,
        name: latestMarker[0].name,
        value: latestMarker[0].value,
        unit: latestMarker[0].unit,
        category: latestMarker[0].category,
        range: {
          min: latestMarker[0].rangeMin,
          max: latestMarker[0].rangeMax,
        },
        trend,
        history: history.map((h) => ({
          date: h.date.toISOString(),
          value: h.value,
        })),
      })
    }

    return markers
  } catch (error) {
    console.error("Error getting health markers:", error)
    return []
  }
}

// Get recent uploads
export async function getRecentUploads(userId = 1, limit = 5) {
  try {
    const uploads = await db
      .select({
        id: schema.bloodTests.id,
        name: schema.bloodTests.name,
        date: schema.bloodTests.date,
        status: schema.bloodTests.status,
      })
      .from(schema.bloodTests)
      .where(eq(schema.bloodTests.userId, userId))
      .orderBy(desc(schema.bloodTests.date))
      .limit(limit)

    return uploads.map((upload) => ({
      id: upload.id.toString(),
      name: upload.name,
      date: upload.date.toISOString(),
      status: upload.status,
    }))
  } catch (error) {
    console.error("Error getting recent uploads:", error)
    return []
  }
}

// Get recommendations
export async function getRecommendations(userId = 1) {
  try {
    const recommendations = await db
      .select()
      .from(schema.recommendations)
      .where(eq(schema.recommendations.userId, userId))
      .orderBy([
        { column: schema.recommendations.completed, order: "asc" },
        { column: schema.recommendations.priority, order: "desc" },
        { column: schema.recommendations.createdAt, order: "desc" },
      ])

    return recommendations.map((rec) => ({
      id: rec.id.toString(),
      title: rec.title,
      description: rec.description,
      priority: rec.priority,
      completed: rec.completed,
    }))
  } catch (error) {
    console.error("Error getting recommendations:", error)
    return []
  }
}


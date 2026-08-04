import Foundation
import HealthKit

struct HealthDailySummary {
    let recordedOn: String
    let steps: Int
    let activeEnergyKcal: Double
    let restingHeartRate: Double?
    let sleepMinutes: Int
    let bodyMassKg: Double?
    let workoutMinutes: Int
    let workoutCount: Int

    var dictionary: [String: Any] {
        [
            "recordedOn": recordedOn,
            "steps": steps,
            "activeEnergyKcal": activeEnergyKcal,
            "restingHeartRate": restingHeartRate as Any,
            "sleepMinutes": sleepMinutes,
            "bodyMassKg": bodyMassKg as Any,
            "workoutMinutes": workoutMinutes,
            "workoutCount": workoutCount,
            "source": "apple-health"
        ]
    }
}

final class HealthKitManager {
    private let store = HKHealthStore()
    private let calendar = Calendar.current

    private var readTypes: Set<HKObjectType> {
        var types = Set<HKObjectType>()
        [
            HKQuantityType.quantityType(forIdentifier: .stepCount),
            HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned),
            HKQuantityType.quantityType(forIdentifier: .restingHeartRate),
            HKQuantityType.quantityType(forIdentifier: .bodyMass),
            HKCategoryType.categoryType(forIdentifier: .sleepAnalysis),
            HKObjectType.workoutType()
        ].compactMap { $0 }.forEach { types.insert($0) }
        return types
    }

    func requestAuthorization(completion: @escaping (Result<Void, Error>) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            completion(.failure(NSError(domain: "Fit33.HealthKit", code: 1, userInfo: [NSLocalizedDescriptionKey: "HealthKit no está disponible en este dispositivo."])))
            return
        }

        store.requestAuthorization(toShare: [], read: readTypes) { success, error in
            if let error { completion(.failure(error)); return }
            success ? completion(.success(())) : completion(.failure(NSError(domain: "Fit33.HealthKit", code: 2, userInfo: [NSLocalizedDescriptionKey: "No se concedieron permisos de Salud."])))
        }
    }

    func readDailySummary(for date: Date, completion: @escaping (Result<HealthDailySummary, Error>) -> Void) {
        let start = calendar.startOfDay(for: date)
        let end = calendar.date(byAdding: .day, value: 1, to: start) ?? date
        let group = DispatchGroup()
        var firstError: Error?
        var steps = 0.0
        var activeEnergy = 0.0
        var restingHeartRate: Double?
        var sleepMinutes = 0
        var bodyMass: Double?
        var workoutMinutes = 0
        var workoutCount = 0

        group.enter(); cumulative(.stepCount, unit: .count(), start: start, end: end) { value, error in steps = value; firstError = firstError ?? error; group.leave() }
        group.enter(); cumulative(.activeEnergyBurned, unit: .kilocalorie(), start: start, end: end) { value, error in activeEnergy = value; firstError = firstError ?? error; group.leave() }
        group.enter(); latest(.restingHeartRate, unit: HKUnit.count().unitDivided(by: .minute()), before: end) { value, error in restingHeartRate = value; firstError = firstError ?? error; group.leave() }
        group.enter(); latest(.bodyMass, unit: .gramUnit(with: .kilo), before: end) { value, error in bodyMass = value; firstError = firstError ?? error; group.leave() }
        group.enter(); sleep(start: start, end: end) { value, error in sleepMinutes = value; firstError = firstError ?? error; group.leave() }
        group.enter(); workouts(start: start, end: end) { minutes, count, error in workoutMinutes = minutes; workoutCount = count; firstError = firstError ?? error; group.leave() }

        group.notify(queue: .global(qos: .userInitiated)) {
            if let firstError { completion(.failure(firstError)); return }
            let day = ISO8601DateFormatter().string(from: start).prefix(10)
            completion(.success(HealthDailySummary(recordedOn: String(day), steps: Int(steps.rounded()), activeEnergyKcal: activeEnergy, restingHeartRate: restingHeartRate, sleepMinutes: sleepMinutes, bodyMassKg: bodyMass, workoutMinutes: workoutMinutes, workoutCount: workoutCount)))
        }
    }

    private func cumulative(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit, start: Date, end: Date, completion: @escaping (Double, Error?) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else { completion(0, nil); return }
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end)
        let query = HKStatisticsQuery(quantityType: type, quantitySamplePredicate: predicate, options: .cumulativeSum) { _, result, error in
            completion(result?.sumQuantity()?.doubleValue(for: unit) ?? 0, error)
        }
        store.execute(query)
    }

    private func latest(_ identifier: HKQuantityTypeIdentifier, unit: HKUnit, before end: Date, completion: @escaping (Double?, Error?) -> Void) {
        guard let type = HKQuantityType.quantityType(forIdentifier: identifier) else { completion(nil, nil); return }
        let predicate = HKQuery.predicateForSamples(withStart: nil, end: end)
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: 1, sortDescriptors: [NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)]) { _, samples, error in
            let sample = samples?.first as? HKQuantitySample
            completion(sample?.quantity.doubleValue(for: unit), error)
        }
        store.execute(query)
    }

    private func sleep(start: Date, end: Date, completion: @escaping (Int, Error?) -> Void) {
        guard let type = HKCategoryType.categoryType(forIdentifier: .sleepAnalysis) else { completion(0, nil); return }
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end)
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            let asleep = (samples as? [HKCategorySample] ?? []).filter { sample in
                if #available(iOS 16.0, *) {
                    return [HKCategoryValueSleepAnalysis.asleepCore.rawValue, HKCategoryValueSleepAnalysis.asleepDeep.rawValue, HKCategoryValueSleepAnalysis.asleepREM.rawValue, HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue].contains(sample.value)
                }
                return sample.value == HKCategoryValueSleepAnalysis.asleep.rawValue
            }
            completion(Int(asleep.reduce(0) { $0 + $1.endDate.timeIntervalSince($1.startDate) } / 60), error)
        }
        store.execute(query)
    }

    private func workouts(start: Date, end: Date, completion: @escaping (Int, Int, Error?) -> Void) {
        let type = HKObjectType.workoutType()
        let predicate = HKQuery.predicateForSamples(withStart: start, end: end)
        let query = HKSampleQuery(sampleType: type, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            let workouts = samples as? [HKWorkout] ?? []
            completion(Int(workouts.reduce(0) { $0 + $1.duration } / 60), workouts.count, error)
        }
        store.execute(query)
    }
}

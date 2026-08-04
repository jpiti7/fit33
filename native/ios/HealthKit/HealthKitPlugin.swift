import Capacitor
import Foundation
import HealthKit

@objc(HealthKitPlugin)
public class HealthKitPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "HealthKitPlugin"
    public let jsName = "HealthKit"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "isAvailable", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "requestAuthorization", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "readDailySummary", returnType: CAPPluginReturnPromise)
    ]

    private let manager = HealthKitManager()

    @objc func isAvailable(_ call: CAPPluginCall) {
        call.resolve(["available": HKHealthStore.isHealthDataAvailable()])
    }

    @objc func requestAuthorization(_ call: CAPPluginCall) {
        manager.requestAuthorization { result in
            DispatchQueue.main.async {
                switch result {
                case .success:
                    call.resolve(["authorized": true])
                case .failure(let error):
                    call.reject(error.localizedDescription)
                }
            }
        }
    }

    @objc func readDailySummary(_ call: CAPPluginCall) {
        let formatter = ISO8601DateFormatter()
        let date = call.getString("date").flatMap(formatter.date(from:)) ?? Date()

        manager.readDailySummary(for: date) { result in
            DispatchQueue.main.async {
                switch result {
                case .success(let summary):
                    call.resolve(summary.dictionary)
                case .failure(let error):
                    call.reject(error.localizedDescription)
                }
            }
        }
    }
}

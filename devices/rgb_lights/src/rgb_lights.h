#pragma once

#include <homecontroller/api/device.h>
#include <homecontroller/api/device_data/rgb_lights.h>

#include "config.h"

class RGBLights : public hc::api::Device<hc::api::rgb_lights::State> {
  public:
    RGBLights() : Device("RGBLights"), m_started(false) {}
    ~RGBLights() {}

    bool init();

    void shutdown();

  private:
    void on_command_received(
        ::sio::socket::ptr socket,
        std::map<std::string, ::sio::message::ptr>& data) override;

    ::sio::message::ptr serialize_state() const override;

    void loop() override;

    void handle_power_on(hc::api::rgb_lights::State& state);
    void handle_power_off(hc::api::rgb_lights::State& state);

    Config m_config;

    bool m_started;
};
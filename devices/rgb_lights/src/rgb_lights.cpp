#include "rgb_lights.h"

#include <homecontroller/socket.io/client.h>

#include <chrono>
#include <iostream>
#include <thread>

bool RGBLights::init() {
    // initialization sequence
    if (!m_config.load("conf/conf.json")) {
        return false;
    }

    hc::util::Logger::set_log_level(hc::util::Logger::string_to_log_level(
        get_logger(), m_config.get_log_level_str()));

    m_config.print();

    get_logger().verbose("Initialization finished!");

    // create initial state
    hc::api::rgb_lights::State state;
    state.m_powered = true;
    state.m_program = hc::api::rgb_lights::State::Program::RainbowFade;
    state.m_color = {255, 255, 255};

    // server url and namespace
    Gateway gateway = {m_config.get_gateway_url(),
                       m_config.get_gateway_namespace()};

    // starts main device loop
    start(gateway, m_config.get_device_id(), m_config.get_secret(), state,
          m_config.get_reconn_delay(), m_config.get_reconn_attempts());

    // shutdown sequence
    get_logger().verbose("Shutting down...");

    return true;
}

void RGBLights::shutdown() {
    get_logger().log("Triggering manual shutdown...");

    stop();
}

void RGBLights::on_command_received(
    ::sio::socket::ptr socket,
    std::map<std::string, ::sio::message::ptr>& data) {
    get_logger().verbose("on_command_received(): Reading command...");

    std::string cmd_name = data["command"]->get_string();

    get_logger().verbose("on_command_received(): Command name is \"" +
                         cmd_name + "\"");

    hc::api::rgb_lights::Command cmd =
        hc::api::rgb_lights::string_to_command(cmd_name);

    hc::api::rgb_lights::State new_state = get_state();
    bool need_update = false;

    switch (cmd) {
    case hc::api::rgb_lights::Command::PowerOn:
        get_logger().verbose(
            "on_command_received(): Executing power on handler");
        handle_power_on(new_state);
        need_update = true;
        break;
    case hc::api::rgb_lights::Command::PowerOff:
        get_logger().verbose(
            "on_command_received(): Executing power off handler");
        handle_power_off(new_state);
        need_update = true;
        break;
    default:
        get_logger().warn("Unimplemented command");
        break;
    }

    if (need_update) {
        update_state(socket, new_state);
    }
}

::sio::message::ptr RGBLights::serialize_state() const {
    ::sio::message::ptr state_msg = ::sio::object_message::create();
    state_msg->get_map()["powered"] =
        ::sio::bool_message::create(get_state().m_powered);
    state_msg->get_map()["program"] = ::sio::string_message::create(
        hc::api::rgb_lights::program_to_string(get_state().m_program));
    state_msg->get_map()["r"] =
        ::sio::int_message::create(get_state().m_color.m_r);
    state_msg->get_map()["g"] =
        ::sio::int_message::create(get_state().m_color.m_g);
    state_msg->get_map()["b"] =
        ::sio::int_message::create(get_state().m_color.m_b);

    return state_msg;
}

void RGBLights::loop() {}

void RGBLights::handle_power_on(hc::api::rgb_lights::State& state) {
    get_logger().log("Power switched ON");
    state.m_powered = true;
}

void RGBLights::handle_power_off(hc::api::rgb_lights::State& state) {
    get_logger().log("Power switched OFF");
    state.m_powered = false;
}